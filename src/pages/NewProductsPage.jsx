import React from 'react'
import NewProducts from '../features/NewProducts'
import "./NewProductsPage.css"
import TopPicks from '../features/TopPicks'
export default function NewProductsPage() {
  return (
    <div className='new-menu-container'>
      <TopPicks></TopPicks>
      <NewProducts></NewProducts>
    </div>
  )
}


