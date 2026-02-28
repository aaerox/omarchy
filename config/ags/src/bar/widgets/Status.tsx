import { Gtk } from "ags/gtk4";
import { Wireplumber } from "../../modules/volume";
import { Battery } from "../../modules/battery";
import { Recording } from "../../modules/recording";
import { Accessor, createBinding, createComputed, With } from "ags";
import { Bluetooth } from "../../modules/bluetooth";
import { Temperature } from "../../modules/temperature";
import { HomeAssistant } from "../../modules/homeassistant";
import { execApp } from "../../modules/apps";

import GObject from "ags/gobject";
import AstalBluetooth from "gi://AstalBluetooth";
import AstalNetwork from "gi://AstalNetwork";
import AstalWp from "gi://AstalWp";


export const Status = () =>
  <Gtk.Box class={"status"} valign={Gtk.Align.CENTER}>
    <Gtk.Box class={"volume-indicators"} spacing={4} valign={Gtk.Align.CENTER}>
      <BatteryStatus
        visible={Battery.getDefault().bindHasBattery()}
        class="battery"
        icon={Battery.getDefault().bindIcon()}
        percentage={Battery.getDefault().bindPercentage()}
      />
      <VolumeButton
        endpoint={Wireplumber.getDefault().getDefaultSink()}
      />
      <Gtk.Button class={"status-button temperature"}
        onClicked={() => execApp("coolercontrol")}>
        <Gtk.Box spacing={2} valign={Gtk.Align.CENTER}>
          <Gtk.Image iconName={"madness-cpu-symbolic"} pixelSize={24} />
          <Gtk.Label
            valign={Gtk.Align.CENTER}
            class={"temp"}
            label={createBinding(Temperature.getDefault(), "temperature").as(
              (temp) => `${temp}°`
            )}
          />
        </Gtk.Box>
      </Gtk.Button>
    </Gtk.Box>

    <Gtk.Revealer revealChild={createBinding(Recording.getDefault(), "recording")}
      transitionDuration={500} transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}>
      <Gtk.Box>
        <Gtk.Image class={"recording state"} iconName={"madness-record-circle-symbolic"}
          pixelSize={24} css={"margin-right: 6px;"}
        />
        <Gtk.Label label={createBinding(Recording.getDefault(), "recordingTime")}
          class={"rec-time"}
        />
      </Gtk.Box>
    </Gtk.Revealer>

    <Gtk.Box class={"status-icons"} spacing={4} valign={Gtk.Align.CENTER}>
      <AmplifierButton />

      <Gtk.Button class={"status-button bluetooth"}
        visible={createBinding(Bluetooth.getDefault(), "adapter").as(Boolean)}
        onClicked={() => execApp("blueberry")}>
        <Gtk.Image
          iconName={"madness-bluetooth-2-symbolic"}
          pixelSize={24}
          css={createBinding(AstalBluetooth.get_default(), "isPowered").as(
            (powered) => powered ? "" : "opacity: 0.4;"
          )}
        />
      </Gtk.Button>

      <Gtk.Box class={"network"}
        visible={createBinding(AstalNetwork.get_default(), "primary").as(
          (primary) => primary !== AstalNetwork.Primary.UNKNOWN
        )}
      >
        <With value={createBinding(AstalNetwork.get_default(), "primary")}>
          {(primary: AstalNetwork.Primary) => {
            switch (primary) {
              case AstalNetwork.Primary.WIRED:
                return <Gtk.Image iconName={"madness-globe-symbolic"} pixelSize={24} />;
              case AstalNetwork.Primary.WIFI:
                return <Gtk.Image iconName={"madness-wifi-symbolic"} pixelSize={24} />;
              default:
                return <Gtk.Image iconName={"madness-wifi-symbolic"} pixelSize={24} css={"opacity: 0.4;"} />;
            }
          }}
        </With>
      </Gtk.Box>
    </Gtk.Box>
  </Gtk.Box> as Gtk.Box;

function VolumeButton(props: {
  endpoint: AstalWp.Endpoint;
}) {
  return (
    <Gtk.Button class={"status-button sink"}
      onClicked={() => execApp("pavucontrol")}
      $={(self) => {
        const conns: Map<GObject.Object, number> = new Map();
        const controllerScroll = Gtk.EventControllerScroll.new(
          Gtk.EventControllerScrollFlags.VERTICAL |
            Gtk.EventControllerScrollFlags.KINETIC
        );

        conns.set(
          controllerScroll,
          controllerScroll.connect("scroll", (_, _dx, dy) => {
            dy > 0
              ? Wireplumber.getDefault().decreaseEndpointVolume(
                  props.endpoint,
                  5
                )
              : Wireplumber.getDefault().increaseEndpointVolume(
                  props.endpoint,
                  5
                );
            return true;
          })
        );

        self.add_controller(controllerScroll);

        conns.set(
          self,
          self.connect("destroy", () =>
            conns.forEach((id, obj) => obj.disconnect(id))
          )
        );
      }}
    >
      <Gtk.Box spacing={2} valign={Gtk.Align.CENTER}>
        <Gtk.Image
          pixelSize={24}
          iconName={createBinding(props.endpoint, "volume").as((vol) =>
            vol === 0 || Wireplumber.getDefault().isMutedSink()
              ? "madness-volume-slash-symbolic"
              : "madness-volume-high-symbolic"
          )}
        />
        <Gtk.Label
          valign={Gtk.Align.CENTER}
          class={"volume"}
          label={createBinding(props.endpoint, "volume").as(
            (vol) => `${Math.floor(vol * 100)}%`
          )}
        />
      </Gtk.Box>
    </Gtk.Button>
  ) as Gtk.Button;
}

function BatteryStatus(props: {
  visible?: Accessor<boolean>;
  class?: string;
  percentage?: Accessor<string>;
  icon?: string | Accessor<string>;
}) {
  return (
    <Gtk.Box visible={props.visible} spacing={2} class={props.class} valign={Gtk.Align.CENTER}>
      {props.icon && <Gtk.Image iconName={props.icon} pixelSize={24} />}
      <Gtk.Label valign={Gtk.Align.CENTER} class={"level"} label={props.percentage} />
    </Gtk.Box>
  ) as Gtk.Box;
}

function AmplifierButton() {
  return (
    <Gtk.Button class={"status-button amplifier"}
      tooltipText={"Toggle amplifier"}
      onClicked={() => HomeAssistant.getDefault().toggle()}>
      <Gtk.Image
        iconName={"madness-speaker-symbolic"}
        pixelSize={24}
        css={createBinding(HomeAssistant.getDefault(), "amplifierOn").as(
          (on) => on ? "" : "opacity: 0.4;"
        )}
      />
    </Gtk.Button>
  ) as Gtk.Button;
}
