<template>
  <div class="html">
    <div class="body">
      <div>
        <h1>SQL interpreter</h1>
        <label for="commands">Enter some SQL</label>
        <br>
        <textarea v-bind="commands">DROP TABLE IF EXISTS employees;
                    CREATE TABLE employees( id          integer,  name    text,
                                              designation text,     manager integer,
                                              hired_on    date,     salary  integer,
                                              commission  float,    dept    integer);

                      INSERT INTO employees VALUES (1,'JOHNSON','ADMIN',6,'1990-12-17',18000,NULL,4);
                      INSERT INTO employees VALUES (2,'HARDING','MANAGER',9,'1998-02-02',52000,300,3);
                      INSERT INTO employees VALUES (3,'TAFT','SALES I',2,'1996-01-02',25000,500,3);
                      INSERT INTO employees VALUES (4,'HOOVER','SALES I',2,'1990-04-02',27000,NULL,3);
                      INSERT INTO employees VALUES (5,'LINCOLN','TECH',6,'1994-06-23',22500,1400,4);
                      INSERT INTO employees VALUES (6,'GARFIELD','MANAGER',9,'1993-05-01',54000,NULL,4);
                      INSERT INTO employees VALUES (7,'POLK','TECH',6,'1997-09-22',25000,NULL,4);
                      INSERT INTO employees VALUES (8,'GRANT','ENGINEER',10,'1997-03-30',32000,NULL,2);
                      INSERT INTO employees VALUES (9,'JACKSON','CEO',NULL,'1990-01-01',75000,NULL,4);
                      INSERT INTO employees VALUES (10,'FILLMORE','MANAGER',9,'1994-08-09',56000,NULL,2);
                      INSERT INTO employees VALUES (11,'ADAMS','ENGINEER',10,'1996-03-15',34000,NULL,2);
                      INSERT INTO employees VALUES (12,'WASHINGTON','ADMIN',6,'1998-04-16',18000,NULL,4);
                      INSERT INTO employees VALUES (13,'MONROE','ENGINEER',10,'2000-12-03',30000,NULL,2);
                      INSERT INTO employees VALUES (14,'ROOSEVELT','CPA',9,'1995-10-12',35000,NULL,1);

                    SELECT designation,COUNT(*) AS nbr, (AVG(salary)) AS avg_salary FROM employees GROUP BY designation ORDER BY avg_salary DESC;
                    SELECT name,hired_on FROM employees ORDER BY hired_on;</textarea>
        <br>
        <button class="button" @click="execute">Execute</button>
        <button id="savedb" class="button">Save the db</button>
        <label class="button">Load an SQLite database file: <input id="dbfile" type="file"></label>
        <div id="error" class="error" />
        <pre v-bind="output">Results will be displayed here</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commands: '555'

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.html {
    margin:auto;
    width:80%;
}

.body{
    background: linear-gradient(#aaa 0, #ddd 10px, #fff 55px);
    border: 1px solid black;
    padding: 10px 20px;
    box-shadow: 5px 0px 30px #000;
    border-radius: 8px;
}

.h1 {
    text-align: center;
    color: #222;
    margin: 0 0 30px;
}

textarea {
    width: 100%;
    height: 200px;
}

.button {
    color: #333;
    background: linear-gradient(#eee, #ddd);
    border: 1px solid #222;
    border-radius: 3px;
    padding: 7px;
    margin-right: 5px;
    transition: .3s;
    font-family: ubuntu, sans-serif;
    font-size: 1em;
}

.button:active {
    background: linear-gradient(#ddd, #eee);
}

.button:hover, button:focus {
    box-shadow: 0 0 2px #222;
}

#execute {
    margin-top: 5px;;
    width: 10%;
    min-width:100px;
}

.CodeMirror {
    border: 1px solid #222;
    height: auto;
}
.CodeMirror-scroll {
    overflow-y: hidden;
    overflow-x: auto;
}

.error {
    color:red;
    transition:.5s;
    overflow:hidden;
    margin: 15px;
}

#output {
    overflow: auto;
}

.table {
    width:auto;
    margin:auto;
    border:1px solid black;
        border-collapse:collapse;
        margin-bottom:10px;
}

.th, td {
    border:1px solid #777;
}

.footer {
    font-size:.8em;
    color: #222;
}
</style>
