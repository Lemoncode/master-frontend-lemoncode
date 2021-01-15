# Adding field validation

Name and Password field are required field.

We want to provide early feedback to the user whenever they fill each of these fields.

Let's implement this validation from scratch (we won't use Final Form, Formik or Fonk).

# Tips

- You can store the field status and evaluate the validaty of the field once the user has updated the value (or in onblur).
- You can show this error message in the textfield (check documentation, error property)
- You can evaluate the fields as well when the user click onLogin

# Caveats

- What if we want to update the user if the field has been visited or if the user has clicked Login.
- What if we won't to automatically fire the validations when the user hits onLogin.
- ...

In the architecure section we will learn how to use Formik + Fonk.
