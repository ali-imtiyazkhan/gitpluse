import React from 'react'

const Overlay = () => {
    return (
        <>
            <div className="absolute h-full w-full bg-gradient-to-t from-[#101010] via-transparent to-[#101010] top-0 left-1/2 -translate-x-1/2 z-10"></div>
            <div className="absolute h-full w-full bg-gradient-to-r from-[#101010] via-transparent to-[#101010] top-0 left-1/2 -translate-x-1/2 z-10"></div>
        </>
    )
}

export default Overlay