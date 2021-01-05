import glob
all = glob.glob("F:\\Projecten\\MotoLogger\\Dashboard\\routes\\*.gpx")

string = "var gpxs = ["
for elem in all:
    afile = "/".join(elem.split("\\")[4:])
    string = string + "\"./"  + afile + "\",\n\t\t"
string = string + "]"
print(string)
f = open("routes.js", "w")
f.write(string)
f.close()