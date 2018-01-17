<?php
	echo "Hello world!"; 

	$db = new SQLite3('Draftkings.db');

	$results = $db->query('SELECT YearWeek FROM Draftkingsdb');
	while ($row = $results->fetchArray()) {
	    var_dump($row);
	}

?>