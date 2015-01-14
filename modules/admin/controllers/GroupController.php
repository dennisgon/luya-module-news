<?php
namespace admin\controllers;

class GroupController extends \admin\base\Controller
{
    public function actionIndex()
    {
        $config = new \luya\ngrest\Config('api-admin-group', 'id');

        $config->list->field("name", "Name")->text()->required();
        $config->list->field("text", "Beschreibung")->textarea();
        $config->list->field("id", "ID")->text();

        $config->create->copyFrom('list');
        $config->update->copyFrom('list');

        $ngrest = new \luya\ngrest\NgRest($config);

        return $ngrest->render(new \luya\ngrest\render\RenderCrud());
    }
}
