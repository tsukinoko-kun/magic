/** OS-identifier, used in `client.os` */
export enum os {
  unknown,
  windows,
  mac,
  linux,
  ios,
  android,
}

class ClientAnalyzer {
  /** @internal */
  private _isMobile: boolean | undefined = undefined;
  /** @internal */
  private getIsMobile() {
    return Boolean(
      "userAgentData" in navigator &&
        typeof (navigator as any).userAgentData.mobile === "boolean"
        ? (navigator as any).userAgentData.mobile
        : /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            navigator.userAgent
          ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
              navigator.userAgent.substring(0, 4)
            )
    );
  }
  /** Weather or not the client hardware is a mobile device. */
  public get isMobile() {
    if (this._isMobile === undefined) {
      return (this._isMobile = this.getIsMobile());
    } else {
      return this._isMobile;
    }
  }

  /** @internal */
  private _platform: string | undefined = undefined;
  /** @internal */
  private getPlatform() {
    if (
      "userAgentData" in navigator &&
      "platform" in (navigator as any).userAgentData &&
      typeof (navigator as any).userAgentData.platform === "string"
    ) {
      return (navigator as any).userAgentData.platform as string;
    } else if (typeof navigator.platform === "string") {
      return navigator.platform;
    } else {
      return "";
    }
  }
  /** Gets the clients device platform. */
  public get platform() {
    if (this._platform === undefined) {
      return (this._platform = this.getPlatform());
    }
    return this._platform;
  }

  /** @internal */
  private _os: os | undefined = undefined;
  /** @internal */
  private getOs() {
    if (this.platform.match(/Mac/i)) {
      return os.mac;
    }
    if (this.platform.match(/Win/i)) {
      return os.windows;
    }
    if (this.platform.match(/Linux/i)) {
      return os.linux;
    }
    if (this.platform.match(/iPhone|iPad/i)) {
      return os.ios;
    }
    if (this.platform.match(/Android/i)) {
      return os.android;
    }
    return os.unknown;
  }
  /** Get the client OS. */
  public get os() {
    if (this._os === undefined) {
      return (this._os = this.getOs());
    }
    return this._os;
  }

  /** @internal */
  private _saveData: boolean | undefined = undefined;

  /** @internal */
  private getSaveData(): boolean {
    if ("connection" in navigator && "saveData" in navigator.connection) {
      return (navigator.connection as any).saveData;
    }

    return false;
  }
  /** Weather or not the browser requests to use less bandwidth. */
  public get saveData(): boolean {
    if (this._saveData === undefined) {
      return (this._saveData = this.getSaveData());
    }

    return this._saveData;
  }

  /** @internal */
  private _prefersReducedMotionQuery: MediaQueryList | undefined = undefined;
  /** @internal */
  private _prefersReducedMotion: boolean | undefined = undefined;
  /** @internal */
  private getPrefersReducedMotion(): boolean {
    if (this._prefersReducedMotionQuery === undefined) {
      this._prefersReducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      if (this._prefersReducedMotionQuery) {
        this._prefersReducedMotionQuery.addEventListener("change", () => {
          if (this._prefersReducedMotionQuery!.matches) {
            this._prefersReducedMotion = true;
          } else {
            this._prefersReducedMotion = false;
          }
        });
      } else {
        return false;
      }
    }

    return (
      this._prefersReducedMotionQuery && this._prefersReducedMotionQuery.matches
    );
  }
  /** Weather or not the browser requests to use less animation. */
  public get prefersReducedMotion(): boolean {
    if (this._prefersReducedMotion === undefined) {
      return (this._prefersReducedMotion = this.getPrefersReducedMotion());
    } else {
      return this._prefersReducedMotion;
    }
  }

  /** @internal */
  private _isTouchDevice: boolean | undefined = undefined;
  /** @internal */
  private getIsTouchDevice(): boolean {
    return (
      "ontouchstart" in window ||
      Number(navigator.maxTouchPoints) > 0 ||
      Number((navigator as any).msMaxTouchPoints) > 0
    );
  }
  /** Weather or not the client is a touch device. */
  public get isTouchDevice(): boolean {
    if (this._isTouchDevice === undefined) {
      return (this._isTouchDevice = this.getIsTouchDevice());
    } else {
      return this._isTouchDevice;
    }
  }
}

/**
 * Contains parsed client information.
 */
export const client = new ClientAnalyzer() as Readonly<ClientAnalyzer>;
