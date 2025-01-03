# Kodi in Docker

## Run in daemon mode

```bash
docker run --rm -d --name kodi_1 --network host ghcr.io/kyzima-spb/kodi
```

### Mount points

* `/run/user/1000/pulse` - directory with PulseAudio files.
* `/kodi` - directory with Kodi files.

### Environment Variables

* `XVFB_RESOLUTION` - screen resolution of the virtual X server, by default `1280x720`
* `VNC_SERVER_PASSWORD` - password for the VNC server, by default not set
* `VNC_SERVER_PASSWORD_FILE` - password for the VNC server, by default not set
* `USER_UID` - user ID, by default is `1000`
* `USER_GID` - user's group ID, by default is `1000`

### Forwarded ports:
* `5900` - TCP port for connecting VNC clients.
