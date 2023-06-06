# Mapbox Tile Update Process

### For RDs, county layer is similar but shouldn't need changes

Install these libraries:

https://gdal.org/download.html#conda which can also be installed with brew: https://formulae.brew.sh/formula/gdal

https://github.com/mapbox/tippecanoe#installation

## NOTE: info/script to use USDA website is out of date, since we use Carissa's custom-made mapbox tiles for now. But this is reference material

Run the attached script to download the RD geography from the US forest service database https://data.fs.usda.gov/geodata/edw/datasets.php?xmlKeyword=Ranger+District+Boundaries, convert it to geoJSON, and then convert it to mbtiles (mapbox tiles).

The intermediate geoJSON conversion is necessary to preserve the zoom of the RD tiles.

Finally, upload this to mapbox studio tilesets https://studio.mapbox.com/tilesets/ and use the tileset ID to connect to the frontend.
