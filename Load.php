<?php
	$myPDO = new PDO('sqlite:/gui/SQLiteStudio/Draftkings.db');
	
	$result = $myPDO->query("SELECT YearWeek FROM DraftkingsDB");

	foreach($result as $row) {
		print $row['YearWeek'] . "\n";
	}
?>