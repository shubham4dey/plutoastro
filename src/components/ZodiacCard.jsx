import React from 'react'

const ZodiacCard = ({name, value, img}) => {
  return (
    <div className='h-20 lg:h-24 xl:h-28 w-full bg-gradient-to-b transition-all relative overflow-hidden btn btn-bg-slide flex justify-center cursor-pointer shadow-sm lg:shadow-md shadow-purple-700 items-center px-4 lg:px-6 py-3 bg-opacity-90 border border-purple-900 rounded-tl-[35px] rounded-br-[30px] hover:border-purple-500 hover:scale-105'>
      <div className='flex w-full justify-start gap-2 lg:gap-3 items-center'>
        <div className='w-3/12 lg:w-4/12 flex justify-center items-center flex-shrink-0'>
          <img alt='sign' className='w-8 lg:w-10 xl:w-12' src={img}></img>
        </div>
        <div className='w-9/12 lg:w-8/12 flex flex-col justify-start items-start overflow-hidden'>
          <span className='text-sm lg:text-base xl:text-xl uppercase font-semibold tracking-wider text-zinc-200 truncate w-full'>{name}</span>
          <span className='text-zinc-300 text-xs lg:text-sm xl:text-base pt-1 tracking-wider uppercase truncate w-full'>{value}</span>
        </div>
      </div>
    </div>
  )
}

export default ZodiacCard