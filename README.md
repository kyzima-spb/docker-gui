# docker-gui

**docker-gui** - is the base image for running GUI applications in Docker.

---
**NOTE**

It's a crazy idea to run GUI applications in Docker containers,
but sometimes there is no other way to run the application on the server
or on the current OS.

---


## How to create a new image?

Let's look at an example of creating a new image to run the Chromium browser in Docker.

### Create image directory

Create a new directory for the image files anywhere and go to it:

```shell
$ mkdir ~/docker-chromium
$ cd ~/docker-chromium
```

Next, create a directory and file structure as shown below:

```
.
├── Dockerfile
└── root
    └── etc
        └── s6-overlay
            └── s6-rc.d
                ├── chromium
                │   ├── dependencies
                │   ├── run
                │   └── type
                └── user
                    └── contents.d
                        └── chromium
```

The image uses the [s6-overlay][1] service manager.
Therefore, to understand why each directory or file is needed,
it is better to refer to the official documentation.

### Create service

The file `./root/etc/s6-overlay/s6-rc.d/chromium/run`
contains the code to start the service (in the example browser).
It is recommended to use the [execline][2] language:

```shell
#!/command/execlineb -P

with-contenv

redirfd -w 2 /dev/null

chromium --no-sandbox --start-maximized
```

In the `./root/etc/s6-overlay/s6-rc.d/chromium/type` file,
specify the type of service: `longrun` - starts at startup, if the service crashes,
it will be restarted (the browser cannot be closed =)

```
longrun
```

In the `./root/etc/s6-overlay/s6-rc.d/chromium/dependencies` file,
specify the dependencies on other services (who should be started first),
one dependency per line:

```
openbox
```

The file `./root/etc/s6-overlay/s6-rc.d/user/contents.d/chromium` is empty,
it is a link indicating that this service is enabled and should be started.

### Dockerfile

Create a new Dockerfile and install the application
with all required dependencies, for example:

```dockerfile
FROM kyzimaspb/gui

# By default, all services run as a normal user
# To install, you need to switch to superuser
USER root

RUN set -x \
    && apt update \
    && apt install -yq --no-install-recommends chromium \
    && apt-get clean  \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Directory containing the description of the service
COPY ./root /

# We return the launch as a normal user
USER user
```

### Build

Build an image file named chromium:

```shell
$ docker build -t chromium .
```

###Run in daemon mode

Run the container named `chromium_1` in daemon mode
and forward the specified ports
to the specified ports of the host machine:

```shell
$ docker run -d --name chromium_1 \
      -p 5900:5900 \
      --shm-size 2g \
      chromium
```

Forwarded ports:

* `5900` - TCP port for connecting VNC clients;

Stop a running container:

```shell
$ docker stop chromium_1
```

## Environment Variables

* `XVFB_RESOLUTION` - screen resolution of the virtual X server;
* `VNC_SERVER_PASSWORD` - the password for the VNC server.

### Autostart with a password

Automatically start the container at system startup
with the password `qwe123` to connect to the VNC server:

```shell  
$ docker run -d --name chromium_1 \
    -p 5900:5900 \
    --shm-size 2g \
    --restart unless-stopped \
    -e VNC_SERVER_PASSWORD=qwe123 \
    chromium
```

The source code for the example is available in the
`examples/chromium` directory.


## Build Arguments

* `RELEASE` - The release name of the Debian distribution.
  Available values are `stretch-slim`, `buster-slim`, `bullseye-slim`.
  The default is `bullseye-slim`.
* `UID` - User ID. The default is `1000`.
* `GID` - The user's group ID. The default is `1000`.
* `S6_DOWNLOAD_URL` - Download URL for [s6-overlay][1].
  The default is ``https://github.com/just-containers/s6-overlay/releases/download``.
* `S6_OVERLAY_VERSION` - [s6-overlay][1] version.
* `S6_ARCH` - [s6-overlay][1] architecture.

### How to change Debian distribution release?

The `RELEASE` build argument allows you to specify the release of the Debian distribution.
Available values `stretch-slim`, `buster-slim`, `bullseye-slim`:

```shell
$ git clone https://github.com/kyzima-spb/docker-gui.git
$ cd docker-gui/docker
$ docker build -t gui --build-arg RELEASE=buster-slim .
```

### How to change s6-overlay version?

```shell
$ git clone https://github.com/kyzima-spb/docker-gui.git
$ cd docker-gui/docker
$ docker build -t gui --build-arg S6_OVERLAY_VERSION=3.1.2.0 .
```

### How to change s6-overlay architecture?

We clone the sources of the base image,
specify the architecture in the `S6_ARCH` argument
and optionally the version in the `S6_OVERLAY_VERSION` argument.
The available values for the selected version can be found on the [downloads page][3].

Build an image, for example, for Orange Pi:

```shell
$ git clone https://github.com/kyzima-spb/docker-gui.git
$ cd docker-gui/docker
$ docker build -t gui --build-arg S6_ARCH=armhf .
```

### How to change UID/GID?

We clone the sources of the base image and build it with the values of the identifiers:

```shell
$ git clone https://github.com/kyzima-spb/docker-gui.git
$ cd docker-gui/docker
$ docker build -t gui \
      --build-arg UID=1001 \
      --build-arg GID=1001 \
      .
```

[1]: <https://github.com/just-containers/s6-overlay> "s6-overlay"
[2]: <https://skarnet.org/software/execline/> "execline"
[3]: <https://github.com/just-containers/s6-overlay/releases> "releases"
