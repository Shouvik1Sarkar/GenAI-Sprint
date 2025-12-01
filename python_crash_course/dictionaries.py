d1 = {
    "s1": "Shouvik",
    "s2": "Somraaj",
    "s3": "Hrithik",
}
d1.pop("s2") # removes the specified item
print(d1)
print(d1["s1"])
print(d1.keys())
print(d1.values())
print(d1.items())

# print(d1["s12"]) # does not exist so error
print(d1.get("s12")) # does not exist but no error, none as answer