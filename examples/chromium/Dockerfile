ARG RELEASE="trixie-slim"

FROM kyzimaspb/gui:$RELEASE

LABEL maintainer="Kirill Vercetti <office@kyzima-spb.com>"

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean; \
    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache \
    && apt-get update && apt-get install -yq --no-install-recommends \
        chromium

COPY ./ /
