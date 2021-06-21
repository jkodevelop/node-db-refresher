create single node

`CREATE (n)`

grab all nodes created

`MATCH (n) RETURN n`

grap all nodes but limit return 

`MATCH (n) RETURN n LIMIT 2`

query
```
MATCH (n) WHERE id(n)=1 RETURN n
MATCH (n) WHERE id(n)<=5 RETURN n
MATCH (n) WHERE id(n) IN [0,2,4] RETURN n
```

delete
```
MATCH (n) DELETE n
MATCH (n) WHERE id(n)=1 DELETE n
MATCH (n) WHERE id(n) IN [1,3] DELETE n
```

using **label**, creating a node with LABEL=Person
```
CREATE (n:Person)
MATCH (n) WHERE n:Person RETURN n
CREATE (n:Person:Manager)
MATCH (n) WHERE n:Person:Manager RETURN n
MATCH (n) WHERE n:Person OR n:Manager RETURN n
```

set/update node with **label** (continue from previous :Person label steps)
```
MATCH (n) SET n:Employee RETURN n
MATCH (n) WHERE id(n)=1 SET n:CEO RETURN n
```

remove **label** from node
```
MATCH (n) REMOVE n:Person RETURN n
MATCH (n) WHERE id(n) IN [1,3] REMOVE n:Employee RETURN n
MATCH (n) WHERE id(n)=1 REMOVE n:CEO SET n:Boss RETURN n
```

delete by **label**

`MATCH (n) WHERE n:CEO DELETE n`

list and count **label**
```
MATCH (n) RETURN DISTINCT labels(n)
MATCH (n) WHERE id(n)=1 RETURN labels(n)
MATCH (n) RETURN DISTINCT count(labels(n))
MATCH (n) RETURN DISTINCT count(labels(n)),labels(n)
```

node **properties** - used with nodes or relationships
  1. keys must always start with a letter, 
  2. keys/values are case sensitive, 
  3. array types cannot have mixed values

```
CREATE (m:User{ 
  firstname:"J",lastname:"K",email:"jk@jk.com",`important notes`:"nothing",age:10,active:true,attributes:["blue","tall"],Active:"100"
}) RETURN m;
MATCH (m:User{firstname:"J"}) RETURN m
MATCH (m:User{attributes:["blue","tall"]}) RETURN m
MATCH (m:User) WHERE m.age > 1 AND (m.active=true OR m.lastname="O") RETURN m
MATCH (m:User) WHERE toInt(m.Active)=100 RETURN m
MATCH (m:User) WHERE m.firstname IN["J","K","A"] RETURN m
```

**properties** update
```
MATCH (m) WHERE m.lastname="K" SET m.lastname="O" RETURN m
MATCH (m:User{email:"jk@jk.com"}) SET m.`important notes`="ok" RETURN m
MATCH (m:User{firstname:"J","lastname":"K"}) SET m.age=9,m.active=false RETURN m
MATCH (m:User{firstname:"J","lastname":"K"}) SET m +={age=11,email:"jj@kk.com"} RETURN m
MATCH (m) WHERE m.lastname="J" SET m:Child RETURN m
```

copy **properties**
```
MATCH (gp{firstname:"jack"}),(sl{firstname:"jill"}) SET gp=sl RETURN gp,sl
MATCH (gp{firstname:"jack"}),(sl{lastname:"jill"}) SET gp=sl RETURN gp,sl
```

delete **properties**
```
MATCH (m:User{email:"jk@jk.com"}) SET m.`important notes`=NULL RETURN m
MATCH (m) REMOVE m.Active RETURN m
MATCH (m) WHERE m.lastname="K" REMOVE m.attributes RETURN m
MATCH (m) WHERE m.active=false DELETE m
MATCH (m) WHERE id(m)=1 REMOVE m.email RETURN m
```

create index
```
CREATE INDEX product_id FOR (p:Product) ON (p.productID);
CREATE INDEX product_name FOR (p:Product) ON (p.productName);
CREATE CONSTRAINT order_id ON (o:Order) ASSERT o.orderID IS UNIQUE;
CALL db.awaitIndexes();
```

create **Relationship**
```
MATCH (a:Employee), (b:Company) WHERE a.name = "Jay Kay" AND b.name = "Amazoom" 
CREATE (b)-[r:EMPLOYED]->(a) 
RETURN a,b 

CREATE (p:Person {name:"J"})-[:LIKES {start:2018}]->(t:Technology {name:"Neo4j"})
```

create a Path using **Relationship**

`CREATE p = (a{name:"London"})-[:NEXT_STOP]->(b{name:"Paris"})-[:LAST_STOP]->(c{name:"Belgium"}) RETURN p`

MERGE command, merge creates if nothing is found
```
MERGE (b:Company {name: "facewall", created: 2000})  RETURN b 

MERGE (a:Company {name: "Walbank", created: 2000}) 
  ON CREATE SET a.isCreated = true 
  ON MATCH SET a.isFound = true
RETURN a

MATCH (a:Employee), (b:Company)
  WHERE a.name = "Jay Kay" AND b.name = "Amazoom"
  MERGE (b)-[r:EMPLOYED]->(a) 
RETURN a,b
```

relationship create & match example
```
CREATE (p:Person)-[:LIKES]->(t:Technology)

//query relationship backwards will not return results
MATCH (p:Person)<-[:LIKES]-(t:Technology)

//better to query with undirected relationship unless sure of direction
MATCH (p:Person)-[:LIKES]-(t:Technology)
```

query examples
```
MATCH (tom:Person {name:'Tom Hanks'})-[rel:DIRECTED]-(movie:Movie)
RETURN tom.name AS name, tom.born AS `Year Born`, movie.title AS title, movie.released AS `Year Released`
```

external neo4j delete whole database (restarts the entire thing) + db user reset

`rm -rf /var/lib/neo4j/data/*`
