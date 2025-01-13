import {
  Action,
  app,
  expose,
  Form,
  fs,
  Icon,
  IconEnum,
  List,
  open,
  path,
  shell,
  toast,
  ui,
  WorkerExtension,
} from "@kksh/api/ui/worker";
import { client, listTrendingRepos } from "@hk/ossinsight-client/heyapi";
client.setConfig({
  baseUrl: "https://api.ossinsight.io/v1",
});

class TrendingRepos extends WorkerExtension {
  async onFormSubmit(value: Record<string, any>): Promise<void> {
    console.log("Form submitted", value);
    toast.success(`Form submitted: ${JSON.stringify(value)}`);
  }
  async load() {
    const trendingRepos = await listTrendingRepos({
      query: {
        // language: "Rust",
      },
    });
    console.log(trendingRepos);

    return ui
      .setSearchBarPlaceholder(
        "Enter a search term, and press enter to open the repo"
      )
      .then(() => {
        return ui.render(
          new List.List({
            items: trendingRepos.data?.data.rows.map(
              (repo) =>
                new List.Item({
                  icon: new Icon({
                    type: IconEnum.Iconify,
                    value: "mdi:github",
                  }),
                  title: repo.repo_name ?? "N/A",
                  value: repo.repo_name ?? "N/A",
                  subTitle: `Language: ${
                    repo.primary_language ?? "N/A"
                  }; Stars: ${repo.stars ?? "N/A"}`,
                })
            ),
          })
        );
      });
  }

  async onActionSelected(actionValue: string): Promise<void> {
    switch (actionValue) {
      case "open":
        break;

      default:
        break;
    }
  }

  onSearchTermChange(term: string): Promise<void> {
    console.log("Search term changed to:", term);
    return Promise.resolve();
  }

  onListItemSelected(value: string): Promise<void> {
    if (value !== "N/A") {
      open.url(`https://github.com/${value}`);
    }
    return Promise.resolve();
  }
}

expose(new TrendingRepos());
