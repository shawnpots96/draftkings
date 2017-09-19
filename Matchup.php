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
	$Player = $_POST['postPlayer'];
	
    //submit SQL query
	$result = mysqli_query($mysqli,"SELECT * FROM history WHERE Player='".$Player."' AND ActualPts = ''");
	
	//Load data array
	$data = array();
	
	while($r = mysqli_fetch_array($result)){ //loop through all rows of the $result while they exist
		echo $r['HomeAway']."_".$r[DVOAPASS]."_".$r[DVOARUSH]."_".$r[DVOAWR1]."_".$r[DVOATE]."_".$r[DVOARB]."_".$r[Division]."_".$r[FavBin]."_".$r[Spread]."_".$r[Position]."_";
	}
		
	// Close database connection
	mysql_close($mysqli);
?>