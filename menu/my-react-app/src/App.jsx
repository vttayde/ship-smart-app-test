// import { useState } from 'react'
// import { MenuItem } from './App';
import './App.css';
// export { useClick, useHover, useMenuState } from './hooks';
import { MenuButton } from './MenuCompo/components/MenuButton';
import { Menu } from '../src/MenuCompo/components/Menu';
// import { ControlledMenu } from './MenuCompo/components/ControlledMenu';
// import { SubMenu } from './MenuCompo/components/SubMenu';
import { MenuItem } from './MenuCompo/components/MenuItem';
// import { FocusableItem } from './MenuCompo/components/FocusableItem';
// import { MenuDivider } from './MenuCompo/components/MenuDivider';
// import { MenuHeader } from './MenuCompo/components/MenuHeader';
// import { MenuGroup } from './MenuCompo/components/MenuGroup';
// import { MenuRadioGroup } from './MenuCompo/components/MenuRadioGroup';


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    {/* <MenuButton>Open</MenuButton> */}
      <Menu menuButton={<MenuButton>Open menu</MenuButton>}>
        <MenuItem>one</MenuItem>
        <MenuItem>Two</MenuItem>
        <MenuItem>Three</MenuItem>
        <MenuItem>four</MenuItem>
        <MenuItem>five</MenuItem>
        <MenuItem>six</MenuItem>
        <MenuItem>seven</MenuItem>
      </Menu>
    </>
  )
}

export default App
