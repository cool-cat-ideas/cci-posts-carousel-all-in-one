import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import TermAutocomplete from '../../../src/admin-v2/components/builder/TermAutocomplete';
import PostSearch from '../../../src/admin-v2/components/builder/PostSearch';

const postTypes = ['post'];
const selectedPosts = [];

const notice = (value) => {
  window.searchNotices.push(value);
};

window.searchNotices = [];

function Fixture() {
  const [taxonomy, setTaxonomy] = useState('category');
  const [selected, setSelected] = useState([]);
  return (
    <>
      <button onClick={() => setTaxonomy('post_tag')}>Switch to tags</button>
      <TermAutocomplete
        taxonomy={{ name: taxonomy, post_type: 'post' }}
        selectedValues={selected.map((term) => term.value)}
        onSelect={(term) => setSelected((items) => [...items, term])}
      />
      <output aria-label="Selected terms">{selected.map((term) => term.label).join(', ')}</output>
      <PostSearch
        postTypes={postTypes}
        selectedPosts={selectedPosts}
        onAdd={() => {}}
        setNotice={notice}
      />
    </>
  );
}

const root = createRoot(document.getElementById('root'));
window.unmountSearch = () => root.unmount();
root.render(<Fixture />);
