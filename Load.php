<?php
	// Get Openshift values
	define('HOST', getenv('OPENSHIFT_MYSQL_DB_HOST'));
	define('USER',getenv('OPENSHIFT_MYSQL_DB_USERNAME'));
	define('PASSWORD',getenv('OPENSHIFT_MYSQL_DB_PASSWORD'));
	define('DATABASE',"draftkings");
	
	// Connect to database
	$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
	
	// Check connection
	if ($mysqli->connect_error) {
	    die("Connection failed: " . $mysqli->connect_error);
	}
	
	//Retrieve names from client-side
	$Indicator = $_POST['postPosition'];
	
	//submit SQL query
	$result = mysqli_query($mysqli,"SELECT DISTINCT Player FROM history WHERE Position='".$Indicator."' AND ActualPts = '' ORDER BY Player");

	//Load data array
	$data = array();
	
	while($r = mysqli_fetch_array($result)){ //loop through all rows of the $result while they exist
		$row[0] = $r['Player'];
	    array_push($data,$row);
	}
	
	echo json_encode($data, JSON_NUMERIC_CHECK);

	// Close database connection
	mysql_close($mysqli);
?>