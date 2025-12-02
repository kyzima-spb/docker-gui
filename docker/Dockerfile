ARG RELEASE=trixie-slim

FROM debian:$RELEASE AS download

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /s6

ARG S6_DOWNLOAD_URL="https://github.com/just-containers/s6-overlay/releases/download"
ARG S6_OVERLAY_VERSION="3.2.1.0"
ARG S6_ARCH="x86_64"

ADD ${S6_DOWNLOAD_URL}/v${S6_OVERLAY_VERSION}/s6-overlay-noarch.tar.xz /tmp
ADD ${S6_DOWNLOAD_URL}/v${S6_OVERLAY_VERSION}/s6-overlay-${S6_ARCH}.tar.xz /tmp

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean; \
    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache \
    && apt update && apt install -yq --no-install-recommends \
        xz-utils

RUN find /tmp -name "s6-overlay-*.tar.xz" -exec tar -Jxpf {} \; -delete

COPY --from=kyzimaspb/useful /apps/secrets/secrets.sh usr/local/bin/read-secret

COPY --from=kyzimaspb/useful /apps/switch-user/switch-user.sh usr/local/share/


FROM debian:$RELEASE

LABEL maintainer="Kirill Vercetti <office@kyzima-spb.com>"

STOPSIGNAL SIGTERM

EXPOSE 5900

WORKDIR /tmp

ENV DEBIAN_FRONTEND=noninteractive
ENV DISPLAY=":99"
ENV USER_UID=1000
ENV USER_GID=1000

RUN useradd -m user -s /bin/bash \
    && install -m 1777 -d .X11-unix

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean; \
    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache \
    && . /etc/os-release \
    && apt-get update && apt-get install -yq --no-install-recommends \
        locales \
        xvfb \
        openbox \
        x11vnc \
        numix-gtk-theme \
        xmlstarlet \
        $([ "$VERSION_CODENAME" = 'buster' ] && echo 'python')

COPY --from=download /s6 /
COPY ./ /

ENTRYPOINT ["/docker-entrypoint.sh", "/init"]
