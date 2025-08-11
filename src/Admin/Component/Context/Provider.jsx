import React from 'react'

const Context = React.createContext()

const Provider = ({children}) => {
    const [state, setState] = React.useState('')
  return (
   <Context.Provider value={{state,setState}}>
     {children}
   </Context.Provider>
  )
}

const useProvider =()=>{
    return React.useContext(Context)
}

export {Provider,useProvider}
