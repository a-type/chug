![Chug Screen GIF](./img/screen1.gif)

# CHUG

> A SIP client in Electron.js for the [Bandwidth Application Platform](http://www.bandwidth.com/application-platform)

## Usage

Chug isn't a generalized SIP client right now. It is designed to work with a Bandwidth SIP endpoint. If that means something to you, though, it might be useful!

Enter your SIP credentials on the login screen, enter a phone number, and go. All fields are automatically stored to a file in your app storage (i.e. AppData for Windows users). You can delete that file if you want to clear them (there's no GUI option for now).

Expand the bottom bar to access extended call options. For now, this only includes the ability to set the `P-Preferred-Identity` header on the call.

Click the "Logs" bar to show detailed SIP logs.

## Standalone Executable

Visit the [Releases](https://github.com/a-type/chug/releases) page for standalone executable builds.

## Development

Chug requires [Electron](https://github.com/atom/electron) pre-built binaries to be installed globally to run. After that, run `npm install` and `npm start`.

## Why "Chug"?

It's a SIP client. Get it?

## License

Chug is MIT Licensed. Attribution is nice!

## Credits

GUI and frontend logic by Grant Forrest. WebRTC-SIP library from [Bandwidth](https://github.com/bandwidthcom/bandwidth-webrtc), which is built on [SIP.js](https://github.com/onsip/SIP.js).
