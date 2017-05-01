<?php
/**
 * User: leon
 * Date: 01/05/17
 */

// recent readings from EA station near maidenhead bridge as json (15 minutes = one period/reading, 288 readings is last few days):
$url  = 'http://environment.data.gov.uk/flood-monitoring/id/measures/2604TH-flow--i-15_min-m3_s/readings?_sorted&_limit=288';
$json = file_get_contents($url);


// parse json
$raw_data = json_decode($json);
var_dump($raw_data);

// use stored data to populate formula for last 3 days to predict gates status