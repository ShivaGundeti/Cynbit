
# 1. Home Screen - Career page

We will use the same logo and navbar used

The first section will look like how existing career page look

My Design :

# 1. Fetch Jobs and Internships

1. get - /api/openings
2. post - /api/openings
3. Update and delete too 
Here in Post we accept:
id
Job title
Department 
Employement type - Full Time / Internship
work mode 
Location


in UI we call this api and we get all the openings

we sort them by Employment type

Now recruiter can add jobs.

# --------------------------------

# 2. User applying for a Role

Apis:

1. /api/role/upload - uploads resume

this api uploads resume and the text is extracted and all the details are
kept

when the upload success return response with the json format
as we expect like

{
    FirstName: Shiva,
    Lastname: Gundeti
    Fullname; Shiva Kumar Gundeti
    Skils: [java,c,python].
    .....
}

these are added to inputs automatically.

# --------------------------------

# Role Based Access

1. Navbar shows a toggle or dropdown that indicates Post a job or recruiter access

recruiter have his credentials given by HR or someone and he will add /update/remvoe jobs etc

Instant jobs on the user portal 

# ------
