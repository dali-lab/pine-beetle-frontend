import json
import csv
from pprint import pprint

all_data = []

# load local json and add to all_data array
with open('historical_data.json') as json_data:
    d = json.load(json_data)
    all_data.append(d)
    json_data.close()

all_data = all_data[0]
entries_found = []

for i in range(len(all_data)):
    if (all_data[i]["latitude"] == None or all_data[i]["longitude"] == None):
        entries_found.append(all_data[i])

# uncomment to print in json-similar format
# pprint(bad)

# open a file for writing
output = open('output.csv', 'w')

# create the csv writer object
csvwriter = csv.writer(output)

# manually write headers
csvwriter.writerow(["_id",'classification','cleridsPerTwoWeeks','forest','forestCode','host','id','latitude','longitude','nf','percentSpb','spbPerTwoWeeks',
                    'spotsPerHundredKm','state','stateCode','year','yearNumber'])

# write each row in entries_found to csv
for entry in entries_found:
      csvwriter.writerow([
          entry["_id"],
          entry["classification"],
          entry["cleridsPerTwoWeeks"],
          entry["forest"],
          entry["forestCode"],
          entry["host"],
          entry["id"],
          entry["latitude"],
          entry["longitude"],
          entry["nf"],
          entry["percentSpb"],
          entry["spbPerTwoWeeks"],
          entry["spotsPerHundredKm"],
          entry["state"],
          entry["stateCode"],
          entry["year"],
          entry["yearNumber"]
      ])

# close
output.close()
