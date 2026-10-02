# 1d array 
# import numpy as np 
# a = np.array([10,20,30,40])

# print (a)
# print (type(a))
# print(a.ndim)
# print(a.shape)
# print(a.size)
# print(a.dtype)
# print(a.itemsize)
# print(a.data)

# 2d array
# import numpy as np
# a = np.array([[1,2,3,],[4,5,6,]])
# print (a)

# zeros array 
# print(np.zeros((3,4)))

# ones array
# print(np.ones((2,3,4,)))

# range array arrange the values in the array 

# lineraly spaced array 
# print (np.linspace(0,100,5))

# acces multiple indexes in the array
# import numpy as np 
# a=np.array([10,20,30,40,50,60])
# print(a[[1,2,3]])

# accessing multiple indexes in the array 
# print (a[[0,2,4]])

# 2D array example
# b = np.array([[1,2],[3,4],[5,6]])

# print (b[[0,2],[1,0]])

# c = np.array([[1,2,3],
            #   [4,5,6],
            #   [7,8,9]])

# print(c[[0, 1, 2], [0, 1, 2]])

# file handling 

# file=open("test.txt","w"),("a"),("x"),("r") create a operation is use on time only 
# file.write("kush bhi /n")
# file.close()

# import data
# file=open("text.txt","w")
# file.write("kush bhi \n")
# file.close()


# file = open("text.txt","r")
# print(file.read())
# print (data)
# file.close()

# with open("demo.txt","w")as file:
#     file.write("pyhton is a programming language \n")
#     file.write("python is a high level programming language \n")
#     file.write("python is good for data science \n")

# openning the file in read mode 
# file = open("demo.txt","r")

# shape manipulation 
# import numpy as np 

# a = np.array([1,2,3,4,5,6,7,8,])
# b = a.reshape(2,4)

# print (b)
# print (b.flatten())
# print (b.T)
# print (b.shape)

# import numpy as np
# a = np.array([10,20,30,40,50])
# print ("sum=",np.sum(a))
# print ("mean=",np.mean(a))
# print ("median=",np.median(a))
# print ("std=",np.std(a))

# import numpy as np
# a = np.array([1,2,3,4,5,6,7,8,9])

# print (np.random.rand())
# print (np.random.rand(3))
# print (np.random.rand(1,100,2))
# print (np.random.rand(1,9,(3,3)))
# names = ["mandhav","khsuh","simran"]

# print (np.random.choice(names)) 
# pandas library 
 
# import pandas as pd 
# a = pd.Series([1,2,3,4,5,6,7,8,9,10])

# print (a)

# import pandas as pd
# from data import df

# sample_data = {
#     "name": ["khush", "simran", "madhav"],
#     "age": [20, 21, 22],
# }


# print(df.head())

# print(pd.DataFrame(sample_data))

# df["age"]= ["adult", "adult", "adult"]
# print (df)

# df.loc[1,"Ages"]="34"
# print (df)

# print(df.sort_index(ascending=False))

# import pandas as pd 
# data = {
#     "department": ['IT','HR','IT','HR'],
#     "salary":[10000,20000,30000,40000]
# }

# df = pd.DataFrame(data)
# print (df)
# g = df.groupby("department")
# print(g["salary"].mean())
# print(g["salary"].max())
# print(g["salary"].sum())

# GroupBy & Aggregation 
# import pandas as pd 
# data = {
#     "department": ['IT','HR','IT','HR'],
#     "salary":[10000,20000,30000,40000]
# }
# df = pd.DataFrame(data)
# print (df)
# g = df.groupby("department")
# print(g["salary"].mean())

# import pandas as pd 
# a= pd.DataFrame({
#     "id":[1,2,3,4],
#     "name":["khush","simran","madhav","kush"],
# })
# b = pd.DataFrame({
#     "id":[1,2,3,4],
#     "age":[20,21,22,23],
# })

# print(pd.merge(a, b, on="id"))

# pivot table 
# import pandas as pd 
# data = {
#     "department": ['IT','HR','IT','HR'],
#     "emp_name": ['khush','simran','madhav','kush'],
#     "salary":[10000,20000,30000,40000]
# }


# df = pd.DataFrame(data)

# Pivot table 
# p = df.pivot(values="salary", index="department", aggfunc="mean")
# print(p)

# Times series 

import pandas as pd
years = pd.date_range(start="2026", periods=5)
print(years)

# creating datafame

df = pd.DataFrame({
    "year": years,
    "sales": [21000] * len(years)
})
print(df)
# setting the date as index
df.set_index("year", inplace=True)
print(df)
print(df.resample("YE").sum())