import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Category } from './category';
import { CategoryList } from './types';
import { MoveDirections } from './enums';

const CategoryWrap = styled.div`
  background: #fff;
  width: 268px;
  padding: 10px 12px;
`;

export const Menu = () => {
  const [categoryList, setCategoryList] = useState<CategoryList>(Object);

  const handleDeleteCategory = (id: string) => {
    const recursiveRemove = (categoryList: CategoryList[], id: string) => {
      return categoryList.filter(category => {
        category.children = recursiveRemove(category.children, id);

        return category.id !== id;
      });
    };

    setCategoryList(prev => ({ ...prev, children: recursiveRemove(categoryList.children, id) }));
  };

  const handleChangePosition = (categoryId: string, parentId: string, direction: string) => {
    const moveUp = (index: number, array: CategoryList[]) => {
      if (index < 1) return;

      [array[index - 1], array[index]] = [array[index], array[index - 1]];

      return array;
    };

    const moveDown = (index: number, array: CategoryList[]) => {
      if (index === array.length - 1) return;

      [array[index], array[index + 1]] = [array[index + 1], array[index]];

       return array;
    };

    let moveDirection = moveUp;

    if (direction === MoveDirections.DOWN) moveDirection = moveDown;

    const parentIndex = categoryList.children.findIndex(category => category.id === parentId);
    let index;

    if (parentIndex === -1) {
      index = categoryList.children.findIndex(category => category.id === categoryId);
      const newArr = moveDirection(index, categoryList.children);

      if (newArr) {
        setCategoryList(prev => ({ ...prev, children: newArr }));
      }
    } else {
      index = categoryList.children[parentIndex].children.findIndex(
        category => category.id === categoryId,
      );
      const newArr = moveDirection(index, categoryList.children[parentIndex].children);

      if (newArr) {
        setCategoryList(prev => {
          const newList = { ...prev };

          newList.children[parentIndex].children = newArr;

          return newList;
        });
      }
    }
  };

  useEffect(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => setCategoryList(data));
  }, []);

  return (
    <CategoryWrap>
      {Object.keys(categoryList).length !== 0 && (
        <Category
          products={categoryList}
          onDeleteClick={handleDeleteCategory}
          onPositionChange={handleChangePosition}
          categoryAmount={categoryList.children.length}
        />
      )}
    </CategoryWrap>
  );
};
