ARG RELEASE=bookworm-slim

FROM debian:$RELEASE

LABEL maintainer="Kirill Vercetti <office@kyzima-spb.com>"

STOPSIGNAL SIGTERM

EXPOSE 5900

ENV DEBIAN_FRONTEND noninteractive
ENV DISPLAY :99
ENV VNC_SERVER_PASSWORD ""

RUN set -ex \
    && . /etc/os-release \
    && apt update \
    && apt install -yq --no-install-recommends \
        locales \
        xz-utils \
        xvfb \
        openbox \
        x11vnc \
        numix-gtk-theme \
        xmlstarlet \
    && if [ "$VERSION_CODENAME" = 'buster' ]; then \
          apt install -yq --no-install-recommends python; \
       fi \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN set -ex \
    && mkdir /tmp/.X11-unix \
    && chmod 1777 /tmp/.X11-unix

ARG UID=1000
ARG GID=1000
RUN set -ex \
    && groupadd -g $GID user \
    && useradd -u $UID -g $GID -s /bin/bash -m user

ARG S6_DOWNLOAD_URL="https://github.com/just-containers/s6-overlay/releases/download"
ARG S6_OVERLAY_VERSION="3.1.6.2"
ARG S6_ARCH="x86_64"
ADD ${S6_DOWNLOAD_URL}/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
ADD ${S6_DOWNLOAD_URL}/v${S6_OVERLAY_VERSION}/s6-overlay-${S6_ARCH}.tar.xz /tmp

RUN find /tmp -name "s6-overlay-*.tar.xz" -exec tar -C / -Jxpf {} \; -delete

COPY ./root /

USER user

RUN set -ex \
    && /bin/bash -c 'mkdir -p /home/user/.config/{gtk-3.0,openbox}' \
    && cp /etc/xdg/openbox/rc.xml /home/user/.config/openbox \
    && xmlstarlet edit -L \
        -N o="http://openbox.org/3.4/rc" \
        -u /o:openbox_config/o:theme/o:name -v Numix \
        -u /o:openbox_config/o:desktops/o:number -v 1 \
            /home/user/.config/openbox/rc.xml \
    && echo "[Settings]\ngtk-theme-name=Numix" > /home/user/.config/gtk-3.0/settings.ini \
    && echo 'gtk-theme-name="Numix"' > /home/user/.gtkrc-2.0

ENTRYPOINT ["/init"]
