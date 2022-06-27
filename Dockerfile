FROM debian:bullseye-slim

ARG S6_DOWNLOAD_URL=https://github.com/just-containers/s6-overlay/releases/download
ARG S6_OVERLAY_VERSION=3.1.0.1
ARG UID=1000
ARG GID=1000

LABEL maintainer="Kirill Vercetti <office@kyzima-spb.com>"

STOPSIGNAL SIGTERM

EXPOSE 5900

ENV DEBIAN_FRONTEND noninteractive
ENV DISPLAY :99
ENV VNC_SERVER_PASSWORD ""

RUN set -ex \
    && apt update \
    && apt-get install -yq --no-install-recommends \
        locales \
        xz-utils \
        xvfb \
        openbox \
        openbox-menu \
        x11vnc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD ${S6_DOWNLOAD_URL}/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
ADD ${S6_DOWNLOAD_URL}/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64.tar.xz /tmp

RUN set -ex \
    && tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz \
    && tar -C / -Jxpf /tmp/s6-overlay-x86_64.tar.xz \
    && rm /tmp/s6-overlay-*.tar.xz

RUN set -ex \
    && mkdir /tmp/.X11-unix \
    && chmod 1777 /tmp/.X11-unix

RUN set -ex \
    && groupadd -g $GID user \
    && useradd -u $UID -g $GID -s /bin/bash -m user

COPY ./root /

USER user

ENTRYPOINT ["/init"]
