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
	$Position = $_POST['postPosition'];
	$HomeAway = $_POST['postHomeAway'];
	$DVOAPASS = $_POST['postDVOAPASS'];
	$Division = $_POST['postDivision'];
	$Favorite = $_POST['postFavorite'];
	
    //submit SQL query
	$result = mysqli_query($mysqli,"SELECT * FROM history WHERE Position='".$Position."' AND HomeAway='".$HomeAway."' AND DVOAPASS='".$DVOAPASS."' AND Division='".$Division."' AND Division='".$Division."' AND ActualPts <> ''");
	
	//Load data array
	$data = array();
	
	while($r = mysqli_fetch_array($result)){ //loop through all rows of the $result while they exist
		echo $r[ActualPts]."_".$r[Average]."_".$r[SD]."_";
	}
		
	// Close database connection
	mysql_close($mysqli);
?>