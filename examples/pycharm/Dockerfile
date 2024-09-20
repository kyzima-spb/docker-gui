FROM debian:bookworm-slim AS download

WORKDIR /pycharm

ARG PYCHARM_VERSION="2024.2.2"
ARG PYCHARM_BASE_URL="https://download.jetbrains.com/python"

ADD ${PYCHARM_BASE_URL}/pycharm-professional-${PYCHARM_VERSION}.tar.gz /tmp/pycharm.tar.gz

RUN tar --strip-components=1 -xzf /tmp/pycharm.tar.gz


FROM kyzimaspb/gui

#RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
#    --mount=type=cache,target=/var/lib/apt,sharing=locked \
#    rm -f /etc/apt/apt.conf.d/docker-clean; \
#    echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache \
#    && apt update && apt install -yq --no-install-recommends \
#        chromium

COPY --from=download /pycharm /opt/pycharm
COPY ./ /
