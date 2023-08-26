FROM osrm/osrm-backend:v5.25.0

WORKDIR /osrm
ADD https://download.geofabrik.de/russia/siberian-fed-district-latest.osm.pbf /data/
COPY . .
RUN osrm-extract -p /opt/car.lua /data/siberian-fed-district-latest.osm.pbf || echo "osrm-extract failed"
COPY . .
RUN osrm-partition /data/siberian-fed-district-latest.osrm || echo "osrm-partition failed"
COPY . .
RUN osrm-customize /data/siberian-fed-district-latest.osrm || echo "osrm-customize failed"
COPY . .
