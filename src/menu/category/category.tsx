import { useState } from 'react';
import styled from 'styled-components';
import { CategoryList } from '../types';
import { MoveDirections } from '../enums';

const CategoryNameWrap = styled.div`
  width: 100%;
  padding: 4px 24px;
  position: relative;
  display: flex;
  align-items: center;
`;

const CategoryName = styled.div<{ $isToggle?: boolean }>`
  cursor: ${props => (props.$isToggle ? 'pointer' : 'auto')};
`;

const CategoryMainIconWrap = styled.div`
  position: absolute;
  left: 0;
  width: 16px;
  height: 14px;
  display: flex;
  align-items: center;
`;

const CategoryMainIcon = styled.div`
  height: 2px;
  background: black;
  margin: 2px 0;
  width: 100%;

  &:before,
  &:after {
    content: '';
    height: 2px;
    width: 100%;
    background: black;
    margin: 2px 0;
    display: block;
    position: absolute;
  }

  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }
`;

const CategoryToggleIcon = styled.div<{ $isExpanded?: boolean }>`
  height: 18px;
  width: 24px;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  font-size: 14px;
  left: 0;

  &:before {
    content: ${props => (props.$isExpanded ? `'-'` : `'+'`)};
    font-size: 18px;
  }
`;

const CategoryActions = styled.div`
  height: 24px;
  position: absolute;
  right: 0;
  top: 1px;
  display: flex;
  align-items: center;
`;

const CategoryWrap = styled.div`
  padding-left: 10px;
`;

const CategoryDeleteIcon = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid red;
  border-radius: 5px;
  position: relative;
  width: 24px;
  height: 24px;
  opacity: 0.3;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:before,
  &:after {
    position: absolute;
    left: 10px;
    content: ' ';
    height: 16px;
    width: 2px;
    background: red;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`;

const CategoryMoveButton = styled.button<{ $isMoveDown?: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgrey;
  border-radius: 5px;
  margin-left: 4px;
  padding: 0;
  opacity: 0.8;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    cursor: auto;
    opacity: 0.5;
  }

  &:after {
    content: '';
    border: solid black;
    border-width: 0 2px 2px 0;
    padding: 3px;
    transform: rotate(${props => (props.$isMoveDown ? '45' : '-135')}deg);
  }
`;

export type CategoryProps = {
  products: CategoryList;
  onDeleteClick: (id: string) => void;
  onPositionChange: (categoryId: string, parentId: string, direction: string) => void;
  position?: number;
  categoryAmount: number;
};

export const Category = ({
  products,
  onDeleteClick,
  onPositionChange,
  position = 0,
  categoryAmount,
}: CategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };

  const hasChildren = products.children.length > 0;
  const isMainCategory = products.level === 0;
  const isFirstPosition = position === 0;
  const isNotLastPosition = position + 1 === categoryAmount;

  return (
    <div>
      <CategoryNameWrap>
        <CategoryName $isToggle={hasChildren} onClick={handleToggle}>
          {isMainCategory && (
            <CategoryMainIconWrap>
              <CategoryMainIcon />
            </CategoryMainIconWrap>
          )}
          {hasChildren && !isMainCategory && <CategoryToggleIcon $isExpanded={isExpanded} />}
          {products.name}
        </CategoryName>
        {!isMainCategory && (
          <CategoryActions>
            <CategoryMoveButton
              disabled={isFirstPosition}
              onClick={() => onPositionChange(products.id, products.parent!, MoveDirections.UP)}
            />
            <CategoryMoveButton
              $isMoveDown
              disabled={isNotLastPosition}
              onClick={() => onPositionChange(products.id, products.parent!, MoveDirections.DOWN)}
            />
            <CategoryDeleteIcon onClick={() => onDeleteClick(products.id)} />
          </CategoryActions>
        )}
      </CategoryNameWrap>
      {isExpanded &&
        products.children?.map((child, index) => {
          return (
            <CategoryWrap key={child.id}>
              <Category
                products={child}
                onDeleteClick={onDeleteClick}
                onPositionChange={onPositionChange}
                position={index}
                categoryAmount={products.children.length}
              />
            </CategoryWrap>
          );
        })}
    </div>
  );
};
