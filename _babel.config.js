const presets = [
    [
        "@babel/preset-env"
        ,
        {
            useBuiltIns: "usage",
            debug: true,
            modules: false
        }
    ]
];

const sourceType = "script";

module.exports = { presets, sourceType };