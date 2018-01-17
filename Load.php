<?php
	echo "Hello world!"; 
 
	/* Specify your sqlite database name and path */
	$dir = 'sqlite:C:/Users/Potvin/Desktop/draftkings/Draftkings.sqlite';
	//$dir = 'sqlite:mydir/myDatabase.sqlite';//
 
	/* Instantiate PDO connection object and failure msg */
	$dbh = new PDO($dir) or die("cannot open database");
 
	/* Define your SQL statement */
	$query = "SELECT YearWeek FROM DraftkingsDB";
 
	/* Iterate through the results and pass into JSON encoder */
	foreach ($dbh->query($query) as $row) {
		echo json_encode($row[0]);
	}

?>