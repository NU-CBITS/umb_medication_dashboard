  <Cfif isdefined("url.uid")>

  <cfset real_id = url.uid>
  <cfset user_hash = hash(real_id, "MD5")>
  <cfset survey = url.survey>
  <cfscript>
try {

classLoader = createObject("java", "java.lang.Class");
classLoader.forName("org.postgresql.Driver");
dm = createObject("java","java.sql.DriverManager");

user_hash = user_hash.toLowercase();

con = dm.getConnection("jdbc:postgresql://165.124.171.126:5432/"&user_hash,"postgres","mohrLab1");

st = con.createStatement();
rs = st.ExecuteQuery("SELECT * FROM ""public""."""&survey&"_survey_responses""");
query = createObject("java", "coldfusion.sql.QueryTable").init(rs);
}


catch(Any excpt) {
	 user_exists = false;
        WriteOutput("<script>console.log('#excpt.type#','#excpt.Message#');
		var excpt = #excpt#;
		var user_exists = true;
		if (excpt.type == 'org.postgresql.util.PSQLException'){
			user_exists = false;
			};

		</script>");
    }

</cfscript>

<cffunction name="queryToJSON" returntype="string" access="public" output="yes">
  <cfargument name="q" type="query" required="yes" />
  <cfset var o=ArrayNew(1)>
  <cfset var i=0>
  <cfset var r=0>
  <cfloop query="Arguments.q">
    <cfset r=Currentrow>
    <cfloop index="i" list="#LCase(Arguments.q.columnList)#">
      <cfset o[r][i]=Evaluate(i)>
    </cfloop>
  </cfloop>
  <cfreturn SerializeJSON(o)>
</cffunction>

<cfoutput>
#queryToJSON(query)#
</cfoutput>

</cfif>