const {age, date} = require('../../lib/utils')
const instructor = require('../models/instructor')

module.exports = {
    index(req, res) {

        const {filter} = req.query 
        
        if (filter) {
            instructor.findBy(filter, function(instrutor) {
                return res.render("instructors/index", {instrutor, filter})
            })
        } else {
            instructor.all(function(instrutor) {
                return res.render("instructors/index", {instrutor})
            })
        }
       
    },
    post(req, res) {
        const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
        }
    }

    instructor.create(req.body, function(instructor) {
        return res.redirect(`/instructors/${instructor.id}`)
    })

    },
    show(req, res) {
       instructor.find(req.params.id, function(instrutor){
           if(!instrutor) return res.send("Instructor not found!")

           instrutor.age = age(instrutor.birth)
           instrutor.services = instrutor.services.split(",")
           instrutor.created_at = date(instrutor.created_at).format

           return res.render("instructors/show", {instrutor})
       })
    },
    create(req, res) {
        return res.render("instructors/create")
    },
    edit(req, res) {
        instructor.find(req.params.id, function(instrutor){
            if(!instrutor) return res.send("Instructor not found!")
 
            instrutor.birth = date(instrutor.birth).iso
          
            return res.render("instructors/edit", {instrutor})
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        instructor.update (req.body, function(){
            return res.redirect(`/instructors/${req.body.id}`)
        })
    },
    delete(req, res) {
        instructor.delete (req.body.id, function(){
            return res.redirect(`/instructors`)
        })
    },
}
