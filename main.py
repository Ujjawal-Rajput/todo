from flask import Flask,redirect,render_template,request,jsonify,g,url_for,session,make_response
import pymongo #for database
from werkzeug.utils import secure_filename
from flask_session import Session
import time,datetime

app=Flask(__name__)
#use below 3 lines for cloud machine database (mongodb atlas)
client = pymongo.MongoClient("mongodb+srv://wiheke7033:wiheke7033@cluster0.vmapbyx.mongodb.net/")
db = client['todo']
todo = db['todo-data']

#general code for flask session and file system
app.config["UPLOAD_FOLDER"]="static/img"
app.config['SECRET_kEY']='secret'
app.config['SESSION_TYPE']='filesystem'
Session(app)

# this function will check session before every request of website.
@app.before_request
def before_request():
    g.user=None
    if 'user' in session:
        g.user=session["user"]

# login authentication page is shown (get)
@app.get('/login')
def login_get():
    if g.user: #just checking the session
        return redirect(url_for('home'))
    else:
        return render_template("login.html")


# login authentication of credentials is done here (post)
@app.post('/login')
def login_post():
    e=request.form['email'].strip()
    p=request.form['password'].strip()
    user = "none"
    if e[-4:len(e)] == ".com": #if entered email
        user = todo.find({"email": e})
    else:  #if entered his/her username
        user = todo.find({"username": e})
    passw = "none"
    usermail = "none"
    for i in user:
        passw = i["password"] #fetching actual password
        usermail = i["email"] #fetching actual email
    
    if user and passw==str(p):
        session['user']=usermail #making session
        time.sleep(2)
        return jsonify([{"msg":"found"}])
    time.sleep(2)
    return jsonify([{"msg":"invalid username / password"}])

# signup page is shown (get)
@app.get('/signup')
def signup_get():
    if g.user:
        return redirect(url_for('home'))
    else:
        return render_template("signup.html")

# signup details of user is taking (post)
@app.post('/signup')
def signup_post():
    e=request.form['email'].strip()
    u=request.form['username'].strip()
    p=request.form['password'].strip()
    todo.insert_one({"email":e,"username": u,"password":p,"todos":[]}) #saving in database
    return jsonify([{"msg":"signed up successfully."}])

# logout function
@app.route("/logout")
def logout():
    session['user']=False
    return redirect(url_for('login_get'))

# for the page shown after login in the account
@app.get("/api/todos")
@app.get("/home")
@app.get("/")
def home():
    if g.user:
        user = todo.find_one({"email":g.user})
        return render_template("home.html",username=user['username'])  #home page
    else:
        return redirect(url_for('login_get'))

# fetching user todos using AJAX
@app.post("/api/todos")
@app.post("/home")
@app.post("/")
def fetch_todos():
    user = todo.find_one({"email":g.user})
    time.sleep(1)
    return jsonify([user['todos'],user['d/t']])

# adding todos in database through the request from AJAX
@app.post("/api/todos/add")
def add_todo():
    t=request.form['title'].strip()
    d=request.form['description'].strip()
    todo.update_one({"email":g.user},{"$push":{"todos":{str(t):str(d)}}})
    add_time = str(datetime.datetime.now())
    todo.update_one({"email":g.user},{"$push":{"d/t":add_time}})
    time.sleep(1)
    return jsonify([{"msg":"added up successfully."}])


# deleting todos from database through the request from AJAX
@app.post("/api/todos/delete")
def delete_todo():
    data=request.get_json()
    title = str(data["title"])
    dates = str(data["d/t"])
    # user = todo.find_one({"email":g.user})
    # for key in user['todos'][0]:
    #     print(user['todos'][0][key])
    # todo.update_one({"email":g.user},{"$set":{"todos":{str(t):str(d)}}})
    todo.update_one({"email":g.user},{"$pull": {"d/t":dates}})
    todo.update_one({"email":g.user},{"$pull": {"todos": {title: {"$exists": True}}}})
    return jsonify([{"msg":"deleted successfully."}])

# updating todos in database through the request from AJAX
@app.post("/api/todos/update")
def update_todo():
    w=int(request.form['who'].strip())
    t=str(request.form['utitle'].strip())
    d=request.form['udescription'].strip()
    todo.update_one({"email":g.user}, {"$set": {f"todos.{w}": {}}})  
    todo.update_one({"email":g.user},{"$set":{f"todos.{w}":{str(t):str(d)} }})

    return jsonify([{"index":w,"key":t,"msg":"updated successfully."}])


# running this backend code
app.run(debug=True)