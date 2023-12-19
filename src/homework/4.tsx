import noop from 'lodash/noop';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

type MenuIds = 'first' | 'second' | 'last';

type Menu = { id: MenuIds; title: string };

type SelectedMenu = {
  id: MenuIds;
};

type MenuSelected = {
  selectedMenu: SelectedMenu;
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: {
    id: 'first',
  },
});

type MenuAction = {
  onSelectedMenu: Dispatch<SetStateAction<SelectedMenu>>;
};

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: ReactNode;
};

function MenuProvider({ children }: PropsProvider) {
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>({
    id: 'first',
  });

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    // Тут есть такая ошибка:
    //'MenuActionContext.Provider' cannot be used as a JSX component.
    //Its return type 'ReactNode' is not a valid JSX element.
    //Type 'undefined' is not assignable to type 'Element | null'.ts(2786)
    //как ее победить?

    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[];
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map(menu => (
        // Тут есть такая ошибка:
        //Property 'div' does not exist on type 'JSX.IntrinsicElements'.ts(2339)
        //эта ошибка повторяется во всех четырех компонентах и со всеми элементами

        <div key={menu.id} onClick={() => onSelectedMenu({ id: menu.id })}>
          {menu.title}{' '}
          {selectedMenu.id === menu.id ? 'Selected' : 'Not selected'}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: 'first',
      title: 'first',
    },
    {
      id: 'second',
      title: 'second',
    },
    {
      id: 'last',
      title: 'last',
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
