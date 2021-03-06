import Docfy from '../src';
import { PageContent } from '../src/types';
import path from 'path';
import visit from 'unist-util-visit';
import { Node } from 'unist';

const root = path.resolve(__dirname, './__fixtures__/monorepo');
function findPage(content: PageContent[], source: string) {
  return content.find((p) => {
    return p.source === source;
  });
}

test('it should have replace internal links between files', async () => {
  const docfy = new Docfy();
  const result = await docfy.run([
    {
      root,
      urlSchema: 'auto',
      pattern: '**/*.md'
    }
  ]);

  expect(
    findPage(result.content, 'docs/how-it-works.md').rendered
  ).toMatchSnapshot();

  expect(
    findPage(result.content, 'packages/package2/docs/overview.md').rendered
  ).toMatchSnapshot();

  expect(
    findPage(result.content, 'packages/package2/docs/styles.md').rendered
  ).toMatchSnapshot();

  // Should replace links from demo files
  findPage(
    result.content,
    'packages/package1/components/button.md'
  ).demos?.forEach((demo) => {
    visit(demo.ast, 'link', (node: Node) => {
      expect(node.url).toMatchSnapshot();
    });
  });
});
