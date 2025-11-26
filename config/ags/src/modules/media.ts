import { Accessor, createConnection, getScope, Scope } from "ags";
import { createScopedConnection, decoder } from "./utils";

import AstalMpris from "gi://AstalMpris";
import GObject from "gi://GObject?version=2.0";
import { property, register } from "ags/gobject";


@register({ GTypeName: "Media" })
export default class Media extends GObject.Object {
    private static instance: Media;
    public static readonly dummyPlayer = {
        available: false,
        busName: "dummy_player",
        bus_name: "dummy_player"
    } as AstalMpris.Player;

    @property(AstalMpris.Player)
    player: AstalMpris.Player = Media.dummyPlayer;

    private updateActivePlayer() {
        const players = AstalMpris.get_default().players.filter(p => p.available);
        console.log(`updateActivePlayer: ${players.length} players available`);

        // Prefer actively playing players
        const playingPlayer = players.find(p => p.playbackStatus === AstalMpris.PlaybackStatus.PLAYING);
        if (playingPlayer) {
            console.log(`Setting player to playing: ${playingPlayer.busName}`);
            this.player = playingPlayer;
            return;
        }

        // Otherwise prefer Spotify (even if paused)
        const spotifyPlayer = players.find(p => p.busName.includes("spotify"));
        if (spotifyPlayer) {
            console.log(`Setting player to spotify: ${spotifyPlayer.busName}`);
            this.player = spotifyPlayer;
            return;
        }

        // Otherwise show first available player or dummy
        console.log(`Setting player to: ${players[0]?.busName || 'dummy'}`);
        this.player = players[0] || Media.dummyPlayer;
    }

    constructor(scope: Scope) {
        super();

        scope.run(() => {
            this.updateActivePlayer();

            createScopedConnection(
                AstalMpris.get_default(),
                "player-added",
                (player) => {
                    if(player.available) {
                        // Listen to playback status changes on this player (not scoped)
                        player.connect("notify::playback-status", () => {
                            this.updateActivePlayer();
                        });
                        // Also listen to metadata changes (for song changes)
                        player.connect("notify::metadata", () => {
                            // Notify that player changed to trigger UI update
                            this.notify("player");
                        });
                        this.updateActivePlayer();
                    }
                }
            );

            createScopedConnection(
                AstalMpris.get_default(),
                "player-closed", () => {
                    this.updateActivePlayer();
                }
            );

            // Also listen to existing players' status and metadata changes
            AstalMpris.get_default().players.forEach(player => {
                if (player.available) {
                    player.connect("notify::playback-status", () => {
                        this.updateActivePlayer();
                    });
                    player.connect("notify::metadata", () => {
                        // Notify that player changed to trigger UI update
                        this.notify("player");
                    });
                }
            });
        });
    }

    public static getDefault(): Media {
        if(!this.instance)
            this.instance = new Media(getScope());

        return this.instance;
    }

    public static accessMediaUrl(player: AstalMpris.Player): Accessor<string|undefined> {
        return createConnection(player.get_meta("xesam:url"),
            [player, "notify::metadata", () => player.get_meta("xesam:url")]
        ).as(url => {
            const byteString = url?.get_data_as_bytes();

            return byteString ? 
                decoder.decode(byteString.toArray())
            : undefined;
          })
    }

    
    public static getMediaUrl(player: AstalMpris.Player): string|undefined {
        if(!player.available) return;

        const meta = player.get_meta("xesam:url");
        const byteString = meta?.get_data_as_bytes();

        return byteString ? 
            decoder.decode(byteString.toArray())
        : undefined;
    }
}
