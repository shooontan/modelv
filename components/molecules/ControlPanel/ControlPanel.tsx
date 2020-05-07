import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export type ControlPanelProps = {
  lists: {
    title: JSX.Element | string;
    item: JSX.Element;
  }[];
};

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  let list: JSX.Element[] = [];
  let panel: JSX.Element[] = [];

  props.lists.forEach((ls, idx) => {
    list.push(<Tab key={idx}>{ls.title}</Tab>);
    panel.push(
      <TabPanel key={idx} forceRender>
        {ls.item}
      </TabPanel>
    );
  });

  return (
    <>
      <div className="cpanel">
        <Tabs>
          <TabList>{list}</TabList>
          {panel}
        </Tabs>
      </div>
      <style jsx>{`
        .cpanel {
          padding: 0 0 60px;
        }

        .cpanel :global(.react-tabs__tab-list) {
          margin: 0 0 60px;
          padding: 0;
          border-bottom: 1px solid #aaa;
          text-align: center;
        }

        .cpanel :global(.react-tabs__tab) {
          display: inline-block;
          padding: 6px 1.5em;
          cursor: pointer;
          list-style: none;
        }

        .cpanel :global(.react-tabs__tab--selected) {
          border-bottom: 2px solid #333;
        }

        .cpanel :global(.react-tabs__tab-panel) {
          display: none;
          margin: 0 auto;
          padding: 2em;
          width: 100%;
          max-width: 600px;
          border: 1px solid #bbb;
          border-radius: 4px;
          box-sizing: border-box;
        }

        .cpanel :global(.react-tabs__tab-panel--selected) {
          display: block;
        }
      `}</style>
    </>
  );
};
