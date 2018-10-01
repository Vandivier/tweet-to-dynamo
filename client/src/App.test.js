import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from './App';

Enzyme.configure({ adapter: new Adapter() })

describe('app initial view', () => {
    const jestWrap = document.createElement('div');

    it('renders without crashing', () => {
        ReactDOM.render(<App />, jestWrap);
    });

    it('has correct heading text', () => {
        const sTitleText = jestWrap.querySelector('h1.App-title').textContent;
        expect(sTitleText).toEqual('Tweet to Dynamo');
    });

    it('binds Twitter username properly', () => {
        const enzymeWrap = Enzyme.shallow(<App />);
        const sStartingOutputText = 'Last tweet taken from Twitter user: ';
        const sTestValue = 'My new value';

        enzymeWrap.find({ name: 'sTwitterUsername'})
            .simulate('change', {target: {name: 'sTwitterUsername', value: sTestValue}});

        expect(enzymeWrap.find('#twitter-username-output').text())
            .toEqual(sStartingOutputText + sTestValue);

           ReactDOM.unmountComponentAtNode(jestWrap);
    });
});
