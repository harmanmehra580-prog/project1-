number = (11,23,45,65,76,78,99,87,65,45)
# sum
total=0
for i in number:
    total+=i
#mean (average)
average= total / len(number) 
# median 
n = len(number)
if n % 2 == 0:
    median = (number[n//2-1]+number[n//2])/2
else:
    median = number[n//2]
print("median",median)
print("mean",average)    
print ("average",average)
print("List",number)
print("sum",total)