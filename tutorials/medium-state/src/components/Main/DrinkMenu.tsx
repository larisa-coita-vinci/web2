interface DrinkMenuProps {
    title: string;
    children: React.ReactNode;
}

const DrinkMenu = ({ title, children }: DrinkMenuProps) => {
    return (
      <div className="drink-menu">
        <h4>{title}</h4>
        <div className="drink-items">{children}</div>
      </div>
    );
  };
  

export default DrinkMenu;
