import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
  const ref = useRef()
  const passwordRef = useRef()

  const [form, setform] = useState({ site: "", username: "", password: "" })
  const [passwordArray, setPasswordArray] = useState([])


  let getpasswords = async () => {
    let req = await fetch("http://localhost:3000/")
    let passwords = await req.json();
    setPasswordArray(passwords)
  }

  useEffect(() => {
    getpasswords()
  }, [])


  const showPassword = () => {
    passwordRef.current.type = "text"
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png"
      passwordRef.current.type = "password"
    }
    else {
      passwordRef.current.type = "text"
      ref.current.src = "icons/eyecross.png"
    }
  }

  const savePassword = async () => {
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

      // If any such id exists in the db, delete it 
      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

      setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
      await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

      // Otherwise clear the form and show toast
      setform({ site: "", username: "", password: "" })
      toast('Password saved!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    else {
      toast('Error: Password not saved', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }
  const deletePassword = async (id) => {
    let c = confirm("Do you really want to delete this password?")
    if (c) {
      setPasswordArray(passwordArray.filter(item => item.id !== id))

      await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

      toast('Password Deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  const editPassword = (id) => {
    setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
    setPasswordArray(passwordArray.filter(item => item.id !== id))

  }

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }

  const copyText = (text) => {
    toast('Copied to clipboard!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="p-3 md:mycontainer min-h-[82.2vh]">
        <h1 className='text-4xl font-bold text-center'><span className='text-green-500'> &lt;</span>
          <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
        </h1>
        <p className='text-green-900 text-lg text-center mb-5'>Your own Password Manager</p>

        <div className="flex flex-col text-black p-4 gap-8 items-center">
          <input value={form.site} name='site' onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" id='site' />
          <div className="flex w-full justify-between gap-8 flex-col md:flex-row">
            <input value={form.username} name='username' onChange={handleChange} placeholder='Enter Username' id='username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" />
            <div className="relative">
              <input ref={passwordRef} value={form.password} name='password' type='password' onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' id='password' />
              <span onClick={showPassword} className='absolute right-[3px] top-[4px] cursor-pointer'>
                <img ref={ref} src="icons/eye.png" width={26} className='p-1' alt="eye" />
              </span>
            </div>
          </div>

          <button onClick={savePassword} className='flex justify-center items-center bg-green-400
          hover:bg-green-500 rounded-full px-5 py-2 w-fit gap-2 border border-green-800'>
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover">
            </lord-icon>
            Save Password</button>
        </div>

        <div className="passwords">
          <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
          {passwordArray.length === 0 && <div>No Passwords to Display</div>}
          {passwordArray.length != 0 && <table className="table-auto w-full overflow-hidden rounded-md mb-10">
            <thead className='bg-green-800 text-white'>
              <tr>
                <th className='py-2'>Website</th>
                <th className='py-2'>Username</th>
                <th className='py-2'>Password</th>
                <th className='py-2'>Actions</th>
              </tr>
            </thead>
            <tbody className='bg-green-100'>
              {passwordArray.map((item, index) => {
                return <tr key={index}>
                  <td className='text-center py-2 border border-white'>
                    <div className="flex items-center justify-center">
                      <a href={item.site} target='_blank'><span>{item.site}</span></a>
                      <div className="cursor-pointer size-7">
                        {/* <lord-icon
                          style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                          src="https://cdn.lordicon.com/lyrrgrsl.json"
                          trigger="hover">
                        </lord-icon> */}
                        <i onClick={() => { copyText(item.site) }} className="fa-regular fa-copy mx-3 text-lg"></i>
                      </div>
                    </div>
                  </td>
                  <td className='text-center py-2 border border-white'>
                    <div className="flex items-center justify-center">
                      <span>   {item.username} </span>
                      <div className="cursor-pointer size-7">
                        <i onClick={() => { copyText(item.username) }} className="fa-regular fa-copy mx-3 text-lg"></i>
                      </div>
                    </div>
                  </td>
                  <td className='text-center py-2 border border-white'>
                    <div className="flex items-center justify-center">

                      <span>{item.password}</span> <div className="cursor-pointer size-7">
                        <i onClick={() => { copyText(item.password) }} className="fa-regular fa-copy mx-3 text-lg"></i>
                      </div>
                    </div></td>
                  <td className='text-center py-2 border border-white'>
                    <span className="cursor-pointer mx-1" onClick={() => { editPassword(item.id) }}>
                      <lord-icon
                        src="https://cdn.lordicon.com/wuvorxbv.json"
                        trigger="hover"
                        style={{ "width": "25px", "height": "25px" }}>
                      </lord-icon>
                    </span>
                    <span className="cursor-pointer mx-1" onClick={() => { deletePassword(item.id) }}>
                      <lord-icon
                        src="https://cdn.lordicon.com/drxwpfop.json"
                        trigger="hover"
                        style={{ "width": "25px", "height": "25px" }}>
                      </lord-icon>
                    </span>
                  </td>
                </tr>
              })}
            </tbody>
          </table>}
        </div>
      </div>
    </>
  )
}

export default Manager
