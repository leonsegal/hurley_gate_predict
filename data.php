<?php
/**
 * User: leon
 * Date: 01/05/17
 */

// readings from EA station maidenhead bridge (15 minutes is 1 reading, 288 readings is last few days):
$url  = 'http://environment.data.gov.uk/flood-monitoring/id/measures/2604TH-flow--i-15_min-m3_s/readings?_sorted&_limit=288';
$json = file_get_contents($url);

// parse json
$raw_data = json_decode($json);

// filter out flow readings
$readings = [];
foreach ($raw_data->items as $item) {
    $readings[] = $item->value;
}
echo "<pre>";
print_r($readings);
echo "</pre>";

// use data to populate formula for last 3 days to predict gates status
