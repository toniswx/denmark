'use client'
import React from 'react'
import { Button } from './ui/button';
import {PlusIcon,FileIcon, PlusCircledIcon} from '@radix-ui/react-icons'
import { DropdownMenuDemo } from './dropdownmenu';
import { useRouter } from 'next/navigation';
import userStore from '../../store/user';
function menubar() {

  const route = useRouter()

  const user = userStore((state) => state.user)
  const team = userStore((state) => state.currentTeamIndex)

  return (
    <div className='flex flex-col shadow-lg z-10 h-screen w-[300px] items-center justify-between fixed top-0'>
       
       <div className='w-full p-3'>
       <div className='w-full flex items-center justify-center my-4 p-2'>
       <svg width="139" height="90" viewBox="0 0 289 90" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M119.887 73.3097H99.9027V16.3149H118.768C125.536 16.3149 130.359 17.5406 133.236 19.992C136.167 22.3901 137.633 25.7475 137.633 30.064V31.8226C137.633 35.0734 136.993 37.7113 135.714 39.7363C134.435 41.7081 132.543 43.1736 130.039 44.1329C132.863 45.0388 134.995 46.4777 136.434 48.4494C137.873 50.3679 138.592 52.8992 138.592 56.0434V58.2017C138.592 62.9446 137.1 66.6483 134.116 69.3129C131.185 71.9774 126.442 73.3097 119.887 73.3097ZM118.928 23.9888H109.015V40.2959H118.848C122.152 40.2959 124.576 39.6831 126.122 38.4574C127.667 37.2317 128.44 35.2333 128.44 32.4621V31.0233C128.44 28.6252 127.667 26.8666 126.122 25.7475C124.63 24.5751 122.232 23.9888 118.928 23.9888ZM118.528 48.0497H109.015V65.2361H118.688C122.471 65.2361 125.136 64.6233 126.681 63.3976C128.28 62.1186 129.08 60.1468 129.08 57.4823V55.7237C129.08 53.0591 128.227 51.114 126.522 49.8883C124.816 48.6626 122.152 48.0497 118.528 48.0497Z" fill="black"/>
<path d="M158.177 66.9947C159.402 66.9947 160.548 66.8615 161.614 66.595C162.733 66.2753 163.746 65.7957 164.652 65.1562C166.464 63.9838 167.849 62.4117 168.808 60.4399C169.821 58.4681 170.327 56.3898 170.327 54.2049V49.2488C169.581 49.8883 168.542 50.4478 167.21 50.9275C165.877 51.4071 164.252 51.8601 162.333 52.2864C159.935 52.8193 158.123 53.3256 156.898 53.8052C155.672 54.2848 154.606 54.8976 153.7 55.6437C152.954 56.2832 152.368 57.0293 151.942 57.8819C151.569 58.7346 151.382 59.7205 151.382 60.8396V61.1593C151.382 62.9712 151.942 64.4101 153.061 65.4759C154.233 66.4884 155.939 66.9947 158.177 66.9947ZM171.686 73.3097L170.647 64.9963C169.315 67.7674 167.316 70.0056 164.652 71.711C162.04 73.4163 158.763 74.2689 154.819 74.2689C150.45 74.2689 147.119 73.2297 144.827 71.1514C142.536 69.0731 141.39 66.1687 141.39 62.4383V61.7189C141.39 59.3741 141.843 57.349 142.749 55.6437C143.655 53.8851 144.934 52.4196 146.586 51.2472C147.119 50.8742 147.652 50.5544 148.185 50.288C148.771 49.9682 149.33 49.6751 149.863 49.4087C151.036 48.929 152.421 48.5027 154.02 48.1297C155.672 47.7034 157.724 47.2237 160.175 46.6908C163.959 45.8915 166.57 45.0921 168.009 44.2927C169.501 43.4401 170.247 42.1078 170.247 40.2959V40.136C170.247 38.111 169.581 36.5389 168.249 35.4198C166.97 34.3007 164.812 33.7411 161.774 33.7411C158.576 33.7411 156.178 34.4605 154.58 35.8994C153.034 37.3383 152.208 39.3633 152.102 41.9746V43.973H142.669V41.8946C142.936 37.205 144.668 33.4746 147.865 30.7035C151.116 27.8791 155.645 26.4669 161.454 26.4669C167.796 26.4669 172.326 27.7992 175.043 30.4637C177.815 33.075 179.2 36.6988 179.2 41.3351V73.3097H171.686Z" fill="black"/>
<path d="M194.047 73.3097H184.934V27.3462H192.368L193.647 37.2583C194.34 33.5812 195.725 30.9433 197.804 29.3446C199.935 27.7459 202.973 26.9465 206.917 26.9465H209.395V36.5389H205.638C204.092 36.5389 202.707 36.6455 201.481 36.8586C200.308 37.0718 199.296 37.3915 198.443 37.8179C196.791 38.6705 195.646 40.0561 195.006 41.9746C194.367 43.893 194.047 46.451 194.047 49.6485V73.3097Z" fill="black"/>
<path d="M229.245 74.3489C222.797 74.3489 217.894 72.6169 214.536 69.153C211.232 65.6358 209.58 60.5998 209.58 54.045V47.0905C209.58 44.799 209.794 42.7206 210.22 40.8555C210.646 38.937 211.259 37.205 212.058 35.6596C213.764 32.622 216.109 30.3305 219.093 28.785C222.077 27.1863 225.514 26.3869 229.405 26.3869C235.107 26.3869 239.663 27.8258 243.074 30.7035C246.484 33.5812 248.35 38.0577 248.669 44.1329V45.6516H238.917V44.1329C238.651 40.7222 237.745 38.2442 236.199 36.6988C234.654 35.1533 232.389 34.3806 229.405 34.3806C226.207 34.3806 223.676 35.4464 221.811 37.5781C219.999 39.7097 219.093 42.9072 219.093 47.1704V53.8851C219.093 57.7754 219.972 60.7863 221.731 62.9179C223.543 65.0496 226.074 66.1154 229.325 66.1154C232.309 66.1154 234.574 65.316 236.119 63.7173C237.718 62.1186 238.677 59.6405 238.997 56.2832V54.4447H248.749V56.4431C248.43 62.5715 246.511 67.1013 242.994 70.0323C239.53 72.91 234.947 74.3489 229.245 74.3489Z" fill="black"/>
<path d="M267.903 66.9947C269.129 66.9947 270.275 66.8615 271.34 66.595C272.46 66.2753 273.472 65.7957 274.378 65.1562C276.19 63.9838 277.576 62.4117 278.535 60.4399C279.547 58.4681 280.054 56.3898 280.054 54.2049V49.2488C279.307 49.8883 278.268 50.4478 276.936 50.9275C275.604 51.4071 273.978 51.8601 272.06 52.2864C269.662 52.8193 267.85 53.3256 266.624 53.8052C265.398 54.2848 264.333 54.8976 263.427 55.6437C262.681 56.2832 262.094 57.0293 261.668 57.8819C261.295 58.7346 261.109 59.7205 261.109 60.8396V61.1593C261.109 62.9712 261.668 64.4101 262.787 65.4759C263.96 66.4884 265.665 66.9947 267.903 66.9947ZM281.412 73.3097L280.373 64.9963C279.041 67.7674 277.043 70.0056 274.378 71.711C271.767 73.4163 268.489 74.2689 264.546 74.2689C260.176 74.2689 256.845 73.2297 254.554 71.1514C252.262 69.0731 251.117 66.1687 251.117 62.4383V61.7189C251.117 59.3741 251.57 57.349 252.475 55.6437C253.381 53.8851 254.66 52.4196 256.312 51.2472C256.845 50.8742 257.378 50.5544 257.911 50.288C258.497 49.9682 259.057 49.6751 259.59 49.4087C260.762 48.929 262.148 48.5027 263.746 48.1297C265.399 47.7034 267.45 47.2237 269.902 46.6908C273.685 45.8915 276.297 45.0921 277.735 44.2927C279.228 43.4401 279.974 42.1078 279.974 40.2959V40.136C279.974 38.111 279.307 36.5389 277.975 35.4198C276.696 34.3007 274.538 33.7411 271.5 33.7411C268.303 33.7411 265.905 34.4605 264.306 35.8994C262.761 37.3383 261.935 39.3633 261.828 41.9746V43.973H252.396V41.8946C252.662 37.205 254.394 33.4746 257.591 30.7035C260.842 27.8791 265.372 26.4669 271.181 26.4669C277.522 26.4669 282.052 27.7992 284.77 30.4637C287.541 33.075 288.926 36.6988 288.926 41.3351V73.3097H281.412Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.08387 2.08814C9.42088 0.75113 11.2343 0 13.1251 0H53.7865L78.8392 25.0527V78.733C78.8392 80.6238 78.0881 82.4372 76.7511 83.7742C75.4141 85.1112 73.6007 85.8624 71.7099 85.8624H61.9457V78.113H71.0899V28.2626L50.5767 7.74931H13.745V36.4218H5.99573V7.12936C5.99573 5.23854 6.74686 3.42516 8.08387 2.08814Z" fill="#0056FC"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M48.307 3.87465H56.0563V22.783H74.9646V30.5323H48.307V3.87465Z" fill="#0056FC"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.3986 36.4057L37.4605 55.09L58.7972 56.7342L42.5334 70.1641L47.4452 90L29.3986 79.3801L11.352 90L16.2638 70.1641L0 56.7342L21.3367 55.09L29.3986 36.4057ZM29.3986 55.966L26.5979 62.4569L19.7407 62.9853L24.958 67.2935L23.3034 73.9754L29.3986 70.3885L35.4938 73.9754L33.8392 67.2935L39.0565 62.9853L32.1993 62.4569L29.3986 55.966Z" fill="#0056FC"/>
</svg>


        </div>
         <DropdownMenuDemo />
       </div>
       <div className='w-full p-2 h-20'>
       <Button className='w-full text-start flex justify-start items-center cursor-pointer'asChild onClick={()=>{
        route.push("/workspace/newtask/"+user?.teams[team].teamId)
       }}>
        <p>Create new task <PlusIcon className='ml-2' /> </p>
       </Button>

       </div>
    </div>
  )
}

export default menubar