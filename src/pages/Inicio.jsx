import React from 'react'
import Sidebar from '../componentes/Sidebar';
import Biblioteca from '../componentes/Biblioteca';
import Playlist from '../componentes/Playlist';
import Artistas from '../componentes/Artistas';



function Inicio() {

  return (
    <>
      <div className='bg-black min-h-screen'>
        <Sidebar />
        <div className="flex bg-black text-white p-2.5 mb-5">
          <div className='flex flex-col'>
            <Biblioteca />
          </div>

          <div className='flex-1 flex flex-col ml-1.5'>
            <div className='flex-1' >
              <Artistas />
              
               
              <Playlist />
            </div>

          </div>

        </div>
      </div>

    </>
  )
}

export default Inicio
