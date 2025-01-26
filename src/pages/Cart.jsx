import React, { useState } from 'react'
import Modal from '../components/Modal'

export default function Cart() {
    const [isOpen,setIsOpen]=useState(false);
  return (
    <div>
      this is cart
      <Modal open={isOpen}></Modal>
    </div>
  )
}
