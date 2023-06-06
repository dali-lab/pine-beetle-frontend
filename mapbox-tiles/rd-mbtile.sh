#!/bin/bash

# these lines are out of date but may be used in the future

# curl https://data.fs.usda.gov/geodata/edw/edw_resources/shp/S_USA.RangerDistrict.zip --output S_USA.RangerDistrict.zip
# unzip S_USA.RangerDistrict.zip
# ogr2ogr -f GeoJSON RD.geojson S_USA.RangerDistrict.shp

# Z3 means minimum zoom-out to level 3, z14 is max zoom-in to level 14. staying consistent with county layer.
tippecanoe -o RD.mbtiles -Z3 -z14 RD.geojson
